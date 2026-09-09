#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class Access : Instruction
  {
  public:
    const static char TypeName = 0;
    Access(char *binary, int offset);
    ~Access();
    const int get_end() const;

  private:
    Instruction *subject;
    LiteralString *key;
    int end;
  };
}