#include "./Variable.h"
#include "./VariableTuplePart.h"
#include <vector>

namespace Storage
{
  class Frame
  {
  public:
    static Frame *From(char *data);

    Frame();
    ~Frame();
    Variable *search(char *name);
    Frame *add_variable(char *name, Variable *value);
    Frame *merge(const Frame *input);

    const val raw() const;

  private:
    std::vector<VariableTuplePart *> data;
  };
}