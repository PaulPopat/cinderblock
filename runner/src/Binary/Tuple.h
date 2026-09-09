#include "./Instruction.h"
#include "./LiteralString.h"
#include <vector>

namespace Binary
{

  class Tuple : Instruction
  {
  public:
    const static char TypeName = 17;
    Tuple(char *binary, int offset);
    ~Tuple();

    const int get_end() const;

  private:
    std::vector<TuplePart> values;
    int end;
  };

  struct TuplePart
  {
    LiteralString *name;
    Instruction *value;
  };
}